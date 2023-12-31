import { $http } from './Axios';
import { FetchCount } from './FetchResult';
import { QueryFilters } from '../../models/filters/QueryFilters';

export interface ICrudEndpoint<DTO> {
  fetchItems(queryFilters: QueryFilters): Promise<DTO[]>;
  fetchItem(itemId: number | string): Promise<DTO>;
  deleteItem(itemId: number | string): Promise<number>;
  updateItem(itemId: string | undefined, newItem: DTO): Promise<DTO>;
  patchItem(itemId: string, item: Partial<DTO>): Promise<DTO>;
  patchAll(itemId: string[], item: Partial<DTO>): Promise<DTO>;
  addItem(item: DTO): Promise<DTO>;
  fetchCount(): Promise<FetchCount>;
}

export abstract class CrudEndpoint<DTO> implements ICrudEndpoint<DTO> {
  protected entityEndpoint: string = '';

  protected constructor(entityEndpoint: string) {
    this.entityEndpoint = entityEndpoint;
  }

  public async fetchItems(queryFilters?: QueryFilters): Promise<DTO[]> {
    const params = queryFilters?.mapQueryFilterToRequestParams();

    const response = await $http.get(`/${this.entityEndpoint}`, {
      params,
    });
    return response.data;
  }

  public async fetchItem(itemId: string): Promise<DTO> {
    const response = await $http.get(`/${this.entityEndpoint}/${itemId}`);
    return response.data;
  }

  public async deleteItem(itemId: string): Promise<number> {
    const response = await $http.delete(`/${this.entityEndpoint}/${itemId}`);
    return response.status;
  }

  public async updateItem(itemId: string, newItem: DTO): Promise<DTO> {
    const response = await $http.put(`/${this.entityEndpoint}/${itemId}`, newItem);
    // Fetch updated item in case PUT doesn't return one
    if (response.status >= 200 && response.status < 400 && !response.data)
      return this.fetchItem(itemId);
    return response.data;
  }

  public async patchItem(itemId: string, item: Partial<DTO>): Promise<DTO> {
    const response = await $http.patch(`/${this.entityEndpoint}/${itemId}`, item);
    return response.data;
  }

  public async patchAll(itemId: string[], item: Partial<DTO>): Promise<DTO> {
    const searchParams = new URLSearchParams();
    itemId.forEach(id => {
      searchParams.append('where[id][inq]', id);
    });
    const response = await $http.patch(
      `/${this.entityEndpoint}?${searchParams.toString()}`,
      item,
    );
    return response.data;
  }

  public async addItem(item: DTO): Promise<DTO> {
    const response = await $http.post(`/${this.entityEndpoint}`, item);
    return response.data;
  }
  public async fetchCount(): Promise<FetchCount> {
    const response = await $http.get(`/${this.entityEndpoint}/count`);
    return response.data;
  }
}
