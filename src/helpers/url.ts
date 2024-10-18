import { SocialsEnum } from 'src/interfaces';

/* eslint-disable no-useless-escape */
const postUrlRegex = {
  [SocialsEnum.TWITTER]:
    /^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/,
  [SocialsEnum.FACEBOOK]:
    /^(?:https?:\/\/)?(?:www\.|m\.|mobile\.|touch\.|mbasic\.)?(?:facebook\.com|fb(?:\.me|\.com))\/(?!$)(?:(?:\w)*#!\/)?(?:pages\/)?(?:photo\.php\?fbid=)?(?:[\w\-]*\/)*?(?:\/)?(?:profile\.php\?id=)?([^\/?&\s]*)(?:\/|&|\?)?.*$/g,
  [SocialsEnum.REDDIT]:
    /(?:^.+?)(?:reddit.com\/r)(?:\/[\w\d]+){2}(?:\/)([\w\d]*)/g,
  [SocialsEnum.YOUTUBE]:
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(?:watch\?v=)?[\w-]{11}$/,
};

export const parsePostUrl = (
  social: SocialsEnum,
  url: string,
): RegExpExecArray | null => {
  const match = postUrlRegex[social].exec(url);

  return match;
};

export const generateRedditEmbedUrl = (url: string): string => {
  if (url.length === 0) return url;

  const postUrl = new URL(url);
  const embedUrl = new URL(postUrl.pathname, 'https://www.redditmedia.com');

  const searchParams = embedUrl.searchParams;
  searchParams.set('ref_source', 'embed');
  searchParams.set('embed', 'true');
  searchParams.set('theme', 'dark');

  embedUrl.search = searchParams.toString();

  return embedUrl.toString();
};

export const forceHttps = (url: string) => {
  if (url.length === 0) return url;

  if (url.search('http') === -1) {
    return 'https://' + url;
  }

  return url;
};

export const extractYouTubeVideoId = (url: string): string | null => {
  const regex =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?.*v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};