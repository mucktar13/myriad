import MyriadAPI from './base';
import {PAGINATION_LIMIT} from './constants/pagination';
import {BaseList} from './interfaces/base-list.interface';

import {Dislike, Like} from 'src/interfaces/interaction';
import {Post, PostProps, ImportPostProps} from 'src/interfaces/post';
import {SocialsEnum} from 'src/interfaces/social';
import {TimelineSortMethod, TimelineFilter, TimelineType} from 'src/interfaces/timeline';

type PostList = BaseList<Post>;
type WalletAddress = {
  walletAddress: string;
};

export const getPost = async (
  page: number,
  userId: string,
  type: TimelineType = TimelineType.TRENDING,
  sort?: TimelineSortMethod,
  filters?: TimelineFilter,
): Promise<PostList> => {
  let orderField = 'originCreatedAt';

  switch (sort) {
    case 'comment':
      orderField = 'metric.comment';
      break;
    case 'like':
      orderField = 'metric.liked';
      break;
    case 'trending':
    default:
      break;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Partial<Record<keyof PostProps, any>> = {};

  if (filters && filters.tags && filters.tags.length) {
    where.tags = {
      inq: filters.tags,
    };
  }

  if (filters && filters.layout === 'photo') {
    // code
  }

  if (filters && filters.platform && filters.platform.length) {
    where.platform = {
      inq: filters.platform,
    };
  }

  if (filters && filters.owner) {
    where.createdBy = {
      eq: filters.owner,
    };
  }

  if (filters && filters.importer) {
    where.createdBy = {
      inq: filters.importer,
    };

    where.platform = {
      inq: [SocialsEnum.TWITTER, SocialsEnum.FACEBOOK, SocialsEnum.REDDIT],
    };
  }

  const {data} = await MyriadAPI.request<PostList>({
    url: '/posts',
    method: 'GET',
    params: {
      filter: {
        page,
        limit: PAGINATION_LIMIT,
        order: `${orderField} DESC`,
        // findBy: userId,
        // sortBy: type,
        where,
        include: [
          {
            relation: 'user',
          },
          {
            relation: 'people',
          },
          {
            relation: 'likes',
            scope: {
              where: {
                userId: {eq: userId},
              },
            },
          },
        ],
      },
    },
  });

  return data;
};

export const createPost = async (values: PostProps): Promise<Post> => {
  const {data} = await MyriadAPI.request<Post>({
    url: '/posts',
    method: 'POST',
    data: values,
  });

  return data;
};

export const importPost = async (values: ImportPostProps): Promise<Post> => {
  const attributes: ImportPostProps = {
    ...values,
    tags: values.tags ?? [],
  };

  const {data} = await MyriadAPI.request<Post>({
    url: `/posts/import`,
    method: 'POST',
    data: attributes,
  });

  return data;
};

export const getPostDetail = async (id: string): Promise<Post> => {
  const {data} = await MyriadAPI.request<Post>({
    url: `/posts/${id}`,
    method: 'GET',
    params: {
      filter: {
        include: [
          {
            relation: 'user',
          },
          {
            relation: 'people',
          },
        ],
      },
    },
  });

  return data;
};

export const like = async (userId: string, postId: string): Promise<void> => {
  await MyriadAPI.request({
    url: `/posts/${postId}/likes`,
    method: 'POST',
    data: {
      status: true,
      userId,
      postId,
    },
  });
};

export const getLikes = async (postId: string): Promise<Like[]> => {
  const {data} = await MyriadAPI.request({
    url: `/posts/${postId}/likes`,
    method: 'GET',
  });

  return data;
};

export const getDislikes = async (postId: string): Promise<Dislike[]> => {
  const {data} = await MyriadAPI.request({
    url: `/posts/${postId}/dislikes`,
    method: 'GET',
  });

  return data;
};

export const dislike = async (userId: string, postId: string): Promise<void> => {
  await MyriadAPI.request({
    url: `/posts/${postId}/dislikes`,
    method: 'POST',
    data: {
      status: true,
      userId,
      postId,
    },
  });
};

export const removePost = async (postId: string): Promise<void> => {
  await MyriadAPI.request({
    url: `/posts/${postId}`,
    method: 'DELETE',
  });
};

export const getWalletAddress = async (postId: string): Promise<WalletAddress> => {
  const {data} = await MyriadAPI.request<WalletAddress>({
    url: `/posts/${postId}/walletaddress`,
    method: 'GET',
  });

  return data;
};
