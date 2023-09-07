import axios, { AxiosRequestConfig } from 'axios';
import { merge } from 'lodash-es';
import { err, ok, Result } from 'neverthrow';

import { ApiError } from './api-error';

export class ApiServiceBase {
  protected urlBase = '/api';

  /**
   * Creates a new service instance.
   * @param path A base path for all requests this service will make. Defaults to `/api`.
   */
  public constructor (path?: string) {
    this.urlBase = path ?? '/api';
  }

  /**
   * Returns a new instance of the base config for all requests this service makes.
   * @protected
   */
  protected getConfig (): AxiosRequestConfig {
    return {
      headers: {
        // Put headers required with every request here
      },
    };
  }

  /**
   * Make a GET request.
   * @param path A path to append to the base url.
   * @param configOverrides A config object to merge onto the base config.
   * @protected
   */
  protected async get<T> (
    path = '',
    configOverrides: AxiosRequestConfig | undefined = undefined,
  ): Promise<Result<T, ApiError>> {
    return await this.requestResultWrapper<T>(path, configOverrides, (fullPath, config) => {
      return axios.get(fullPath, config);
    });
  }

  /**
   * Make a POST request.
   * @param path A path to append to the base url.
   * @param data Optional data to send with the request.
   * @param configOverrides A config object to merge onto the base config.
   * @protected
   */
  protected async post<T> (
    path = '',
    data: unknown = undefined,
    configOverrides: AxiosRequestConfig | undefined = undefined,
  ): Promise<Result<T, ApiError>> {
    return await this.requestResultWrapper<T>(path, configOverrides, (fullPath, config) => {
      return axios.post(fullPath, data, config);
    });
  }

  /**
   * Make a PUT request.
   * @param path A path to append to the base url.
   * @param data Optional data to send with the request.
   * @param configOverrides A config object to merge onto the base config.
   * @protected
   */
  protected async put<T> (
    path = '',
    data: unknown = undefined,
    configOverrides: AxiosRequestConfig | undefined = undefined,
  ): Promise<Result<T, ApiError>> {
    return await this.requestResultWrapper<T>(path, configOverrides, (fullPath, config) => {
      return axios.put(fullPath, data, config);
    });
  }

  /**
   * Make a PATCH request.
   * @param path A path to append to the base url.
   * @param data Optional data to send with the request.
   * @param configOverrides A config object to merge onto the base config.
   * @protected
   */
  protected async patch<T> (
    path = '',
    data: unknown = undefined,
    configOverrides: AxiosRequestConfig | undefined = undefined,
  ): Promise<Result<T, ApiError>> {
    return await this.requestResultWrapper<T>(path, configOverrides, (fullPath, config) => {
      return axios.patch(fullPath, data, config);
    });
  }

  /**
   * Make a DELETE request.
   * @param path A path to append to the base url.
   * @param configOverrides A config object to merge onto the base config.
   * @protected
   */
  protected async delete<T> (
    path = '',
    configOverrides: AxiosRequestConfig | undefined = undefined,
  ): Promise<Result<T, ApiError>> {
    return await this.requestResultWrapper<T>(path, configOverrides, (fullPath, config) => {
      return axios.delete(fullPath, config);
    });
  }

  private async requestResultWrapper<T> (
    subPath: string,
    configOverrides: AxiosRequestConfig | undefined,
    request: (fullPath: string, config: AxiosRequestConfig | undefined) => Promise<{data: unknown} | null>,
  ): Promise<Result<T, ApiError>> {
    if (subPath.length > 0 && subPath[0] !== '/') subPath = `/${subPath}`;
    const config = merge(this.getConfig() || {}, configOverrides || {});
    try {
      const responseData: T = (await request(`${this.urlBase}${subPath}`, config))?.data as T;
      return ok(responseData);
    } catch (e) {
      return err(new ApiError(e));
    }
  }
}
