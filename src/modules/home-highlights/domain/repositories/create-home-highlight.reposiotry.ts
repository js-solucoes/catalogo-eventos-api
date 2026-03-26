import { HomeHighlightEntity } from "../entities/home-highlight.entity";

export interface CreateHomeHighlightRepository {
    create(__homeHighlight: Omit<HomeHighlightEntity, 'id'>):Promise<HomeHighlightEntity|null>
}