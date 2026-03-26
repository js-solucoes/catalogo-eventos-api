
export interface DeleteHomeBannerRepository {
    delete(id: number): Promise<boolean>
}