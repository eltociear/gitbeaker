import * as Mime from 'mime/lite';
import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type { ShowExpanded, GitlabAPIResponse } from '../infrastructure';

export interface PackageSnapshotSchema extends Record<string, unknown> {
  'conan_package.tgz': string;
  'conanfile.py': string;
  'conanmanifest.txt': string;
}

export interface RecipeSnapshotSchema extends Record<string, unknown> {
  'conan_sources.tgz': string;
  'conanfile.py': string;
  'conanmanifest.txt': string;
}

function url(projectId?: string | number) {
  if (projectId) {
    return endpoint`/projects/${projectId}/packages/conan/v1`;
  } else {
    return '/packages/conan/v1';
  }
}

export class Conan<C extends boolean = false> extends BaseResource<C> {
  authenticate<E extends boolean = false>(
    options?: { projectId?: string | number } & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<string, C, E, void>> {
    return RequestHelper.get<string>()(
      this,
      `${url(options?.projectId)}/users/authenticate`,
      options,
    );
  }

  checkCredentials<E extends boolean = false>(
    options?: { projectId?: string | number } & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<string, C, E, void>> {
    return RequestHelper.get<string>()(
      this,
      `${url(options?.projectId)}/users/check_credentials`,
      options,
    );
  }

  downloadPackageFile<E extends boolean = false>(
    packageName: string,
    packageVersion: string,
    packageUsername: string,
    packageChannel: string,
    conanPackageReference: string,
    recipeRevision: string,
    packageRevision: string,
    filename: string,
    options?: { projectId?: string | number } & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<Blob, C, E, void>> {
    return RequestHelper.get<Blob>()(
      this,
      `${url(
        options?.projectId,
      )}/conans/v1/files/${packageName}/${packageVersion}/${packageUsername}/${packageChannel}/${recipeRevision}/package/${conanPackageReference}/${packageRevision}/${filename}`,
      options,
    );
  }

  downloadRecipeFile<E extends boolean = false>(
    packageName: string,
    packageVersion: string,
    packageUsername: string,
    packageChannel: string,
    recipeRevision: string,
    filename: string,
    options?: { projectId?: string | number } & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<Blob, C, E, void>> {
    return RequestHelper.get<Blob>()(
      this,
      `${url(
        options?.projectId,
      )}/conans/v1/files/${packageName}/${packageVersion}/${packageUsername}/${packageChannel}/${recipeRevision}/export/${filename}`,
      options,
    );
  }

  packageUploadUrls<E extends boolean = false>(
    packageName: string,
    packageVersion: string,
    packageUsername: string,
    packageChannel: string,
    conanPackageReference: string,
    options?: { projectId?: string | number } & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<PackageSnapshotSchema, C, E, void>> {
    return RequestHelper.get<PackageSnapshotSchema>()(
      this,
      `${url(
        options?.projectId,
      )}/conans/${packageName}/${packageVersion}/${packageUsername}/${packageChannel}/packages/${conanPackageReference}/upload_urls`,
      options,
    );
  }

  packageDownloadUrls<E extends boolean = false>(
    packageName: string,
    packageVersion: string,
    packageUsername: string,
    packageChannel: string,
    conanPackageReference: string,
    options?: { projectId?: string | number } & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<PackageSnapshotSchema, C, E, void>> {
    return RequestHelper.get<PackageSnapshotSchema>()(
      this,
      `${url(
        options?.projectId,
      )}/conans/${packageName}/${packageVersion}/${packageUsername}/${packageChannel}/packages/${conanPackageReference}/download_urls`,
      options,
    );
  }

  packageManifest<E extends boolean = false>(
    packageName: string,
    packageVersion: string,
    packageUsername: string,
    packageChannel: string,
    conanPackageReference: string,
    options?: { projectId?: string | number } & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<PackageSnapshotSchema, C, E, void>> {
    return RequestHelper.get<PackageSnapshotSchema>()(
      this,
      `${url(
        options?.projectId,
      )}/conans/${packageName}/${packageVersion}/${packageUsername}/${packageChannel}/packages/${conanPackageReference}/digest`,
      options,
    );
  }

  packageSnapshot<E extends boolean = false>(
    packageName: string,
    packageVersion: string,
    packageUsername: string,
    packageChannel: string,
    conanPackageReference: string,
    options?: { projectId?: string | number } & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<PackageSnapshotSchema, C, E, void>> {
    return RequestHelper.get<PackageSnapshotSchema>()(
      this,
      `${url(
        options?.projectId,
      )}/conans/${packageName}/${packageVersion}/${packageUsername}/${packageChannel}/packages/${conanPackageReference}`,
      options,
    );
  }

  ping<E extends boolean = false>(
    options?: { projectId?: string | number } & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<string, C, E, void>> {
    return RequestHelper.post<string>()(this, `${url(options?.projectId)}/ping`, options);
  }

  recipeUploadUrls<E extends boolean = false>(
    packageName: string,
    packageVersion: string,
    packageUsername: string,
    packageChannel: string,
    options?: { projectId?: string | number } & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<RecipeSnapshotSchema, C, E, void>> {
    return RequestHelper.get<RecipeSnapshotSchema>()(
      this,
      `${url(
        options?.projectId,
      )}/conans/${packageName}/${packageVersion}/${packageUsername}/${packageChannel}/upload_urls`,
      options,
    );
  }

  recipeDownloadUrls<E extends boolean = false>(
    packageName: string,
    packageVersion: string,
    packageUsername: string,
    packageChannel: string,
    options?: { projectId?: string | number } & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<RecipeSnapshotSchema, C, E, void>> {
    return RequestHelper.get<RecipeSnapshotSchema>()(
      this,
      `${url(
        options?.projectId,
      )}/conans/${packageName}/${packageVersion}/${packageUsername}/${packageChannel}/download_urls`,
      options,
    );
  }

  recipeManifest<E extends boolean = false>(
    packageName: string,
    packageVersion: string,
    packageUsername: string,
    packageChannel: string,
    options?: { projectId?: string | number } & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<RecipeSnapshotSchema, C, E, void>> {
    return RequestHelper.get<RecipeSnapshotSchema>()(
      this,
      `${url(
        options?.projectId,
      )}/conans/${packageName}/${packageVersion}/${packageUsername}/${packageChannel}/digest`,
      options,
    );
  }

  recipeSnapshot<E extends boolean = false>(
    packageName: string,
    packageVersion: string,
    packageUsername: string,
    packageChannel: string,
    options?: { projectId?: string | number } & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<RecipeSnapshotSchema, C, E, void>> {
    return RequestHelper.get<RecipeSnapshotSchema>()(
      this,
      `${url(
        options?.projectId,
      )}/conans/${packageName}/${packageVersion}/${packageUsername}/${packageChannel}`,
      options,
    );
  }

  removePackageFile<E extends boolean = false>(
    packageName: string,
    packageVersion: string,
    packageUsername: string,
    packageChannel: string,
    options?: { projectId?: string | number } & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.get<void>()(
      this,
      `${url(
        options?.projectId,
      )}/conans/${packageName}/${packageVersion}/${packageUsername}/${packageChannel}`,
      options,
    );
  }

  search<E extends boolean = false>(
    options?: { projectId?: string | number } & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<{ results: string[] }, C, E, void>> {
    return RequestHelper.get<{ results: string[] }>()(
      this,
      `${url(options?.projectId)}/conans/search`,
      options,
    );
  }

  uploadPackageFile<E extends boolean = false>(
    content: string,
    packageName: string,
    packageVersion: string,
    packageUsername: string,
    packageChannel: string,
    conanPackageReference: string,
    recipeRevision: string,
    packageRevision: string,
    filename: string,
    options?: { projectId?: string | number } & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<unknown, C, E, void>> {
    const meta = {
      filename,
      contentType: Mime.getType(filename),
    };

    return RequestHelper.get<unknown>()(
      this,
      `${url(
        options?.projectId,
      )}/conans/v1/files/${packageName}/${packageVersion}/${packageUsername}/${packageChannel}/${recipeRevision}/package/${conanPackageReference}/${packageRevision}/${filename}`,
      {
        isForm: true,
        ...options,
        file: [content, meta],
      },
    );
  }

  uploadRecipeFile<E extends boolean = false>(
    content: string,
    packageName: string,
    packageVersion: string,
    packageUsername: string,
    packageChannel: string,
    recipeRevision: string,
    filename: string,
    options?: { projectId?: string | number } & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<unknown, C, E, void>> {
    const meta = {
      filename,
      contentType: Mime.getType(filename),
    };

    return RequestHelper.get<unknown>()(
      this,
      `${url(
        options?.projectId,
      )}/conans/v1/files/${packageName}/${packageVersion}/${packageUsername}/${packageChannel}/${recipeRevision}/export/${filename}`,
      {
        isForm: true,
        ...options,
        file: [content, meta],
      },
    );
  }
}
