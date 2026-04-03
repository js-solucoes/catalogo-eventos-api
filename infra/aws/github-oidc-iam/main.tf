data "aws_caller_identity" "current" {}

locals {
  account_id = data.aws_caller_identity.current.account_id
  # Padrão alinhado a docs/deployment/github-oidc-aws.md
  oidc_sub = coalesce(
    var.github_oidc_sub_pattern,
    "repo:${var.github_org}/${var.github_repo}:*"
  )
}

# Thumbprints oficiais do GitHub Actions (podem ser atualizados pela AWS/GitHub).
resource "aws_iam_openid_connect_provider" "github" {
  count = var.create_oidc_provider ? 1 : 0

  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = var.github_oidc_thumbprints
}

data "aws_iam_openid_connect_provider" "github" {
  count = var.create_oidc_provider ? 0 : 1
  arn   = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:oidc-provider/token.actions.githubusercontent.com"
}

locals {
  github_oidc_provider_arn = var.create_oidc_provider ? aws_iam_openid_connect_provider.github[0].arn : data.aws_iam_openid_connect_provider.github[0].arn
}

data "aws_iam_policy_document" "github_assume" {
  statement {
    sid     = "GitHubActionsOIDC"
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [local.github_oidc_provider_arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = [local.oidc_sub]
    }
  }
}

resource "aws_iam_role" "github_actions" {
  name               = var.iam_role_name
  assume_role_policy = data.aws_iam_policy_document.github_assume.json

  tags = {
    ManagedBy = "terraform"
    Purpose   = "github-actions-oidc"
  }
}

resource "aws_iam_role_policy_attachment" "readonly" {
  count = var.attach_readonly_access ? 1 : 0

  role       = aws_iam_role.github_actions.name
  policy_arn = "arn:aws:iam::aws:policy/ReadOnlyAccess"
}

data "aws_iam_policy_document" "terraform_lock" {
  count = var.terraform_lock_table_arn != "" ? 1 : 0

  statement {
    sid    = "TerraformStateLock"
    effect = "Allow"
    actions = [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:DeleteItem",
    ]
    resources = [var.terraform_lock_table_arn]
  }
}

resource "aws_iam_role_policy" "terraform_lock" {
  count = var.terraform_lock_table_arn != "" ? 1 : 0

  name   = "${var.iam_role_name}-tf-lock"
  role   = aws_iam_role.github_actions.id
  policy = data.aws_iam_policy_document.terraform_lock[0].json
}

data "aws_iam_policy_document" "ecr_ecs_deploy" {
  count = var.ecr_repository_name != "" && var.ecs_cluster_name != "" ? 1 : 0

  statement {
    sid    = "EcrAuth"
    effect = "Allow"
    actions = [
      "ecr:GetAuthorizationToken",
    ]
    resources = ["*"]
  }

  statement {
    sid    = "EcrPush"
    effect = "Allow"
    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:CompleteLayerUpload",
      "ecr:InitiateLayerUpload",
      "ecr:PutImage",
      "ecr:UploadLayerPart",
    ]
    resources = [
      "arn:aws:ecr:${var.aws_region}:${local.account_id}:repository/${var.ecr_repository_name}",
    ]
  }

  statement {
    sid    = "EcsDeploy"
    effect = "Allow"
    actions = [
      "ecs:UpdateService",
      "ecs:DescribeServices",
      "ecs:DescribeClusters",
    ]
    resources = ["*"]
    condition {
      test     = "ArnEquals"
      variable = "ecs:cluster"
      values = [
        "arn:aws:ecs:${var.aws_region}:${local.account_id}:cluster/${var.ecs_cluster_name}",
      ]
    }
  }
}

resource "aws_iam_role_policy" "ecr_ecs_deploy" {
  count = var.ecr_repository_name != "" && var.ecs_cluster_name != "" ? 1 : 0

  name   = "${var.iam_role_name}-ecr-ecs"
  role   = aws_iam_role.github_actions.id
  policy = data.aws_iam_policy_document.ecr_ecs_deploy[0].json
}
