export interface HomeBannerProps {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaLabel: string;
  ctaUrl: string;
  active: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class HomeBannerEntity {
  constructor(private readonly props: HomeBannerProps) {}

  get id(){
    return this.props.id
  }
  get title(){
    return this.props.title
  }
  get subtitle(){
    return this.props.subtitle
  }
  get imageUrl(){
    return this.props.imageUrl
  }
  get ctaLabel(){
    return this.props.ctaLabel
  }
  get ctaUrl(){
    return this.props.ctaUrl
  }
  get active(){
    return this.props.active
  }
  get order(){
    return this.props.order
  }
}
