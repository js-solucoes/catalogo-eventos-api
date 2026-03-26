import { HomeHighlightEntity } from "../../domain/entities/home-highlight.entity";
import { CreateHomeHighlightRepository } from "../../domain/repositories/create-home-highlight.reposiotry";
import { CreateHomeHighlightDTO } from "../dto";

export class CreateHomeHighlightUseCase {
    constructor(private readonly repo: CreateHomeHighlightRepository) {}

    async execute(__homeHighlight: CreateHomeHighlightDTO):Promise<HomeHighlightEntity|null> {
        return await this.repo.create(__homeHighlight)
    }
}