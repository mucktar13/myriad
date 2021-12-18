import {Post} from 'src/interfaces/post';

export type PostHeaderProps = {
  owner: boolean;
  post: Post;
  tipped?: boolean;
  onDelete: () => void;
  onOpenTipHistory: () => void;
  onReport: () => void;
  onVisibility: () => void;
  onImporters: () => void;
  disableAction?: boolean;
};
