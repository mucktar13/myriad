import {useSelector, useDispatch} from 'react-redux';

import {Post} from 'src/interfaces/post';
import {Transaction} from 'src/interfaces/transaction';
import {ListMeta} from 'src/lib/api/interfaces/base-list.interface';
import {RootState} from 'src/reducers';
import {
  setTippedPost,
  clearTippedPost,
  fetchTransactionHistory,
} from 'src/reducers/tip-summary/actions';
import {TipSummaryState} from 'src/reducers/tip-summary/reducer';

type TipSummaryHookProps = {
  meta: ListMeta;
  show: boolean;
  post: Post | null;
  transactions: Transaction[];
  loadTransaction: (post: Post, page?: number) => void;
  loadNextTransaction: (post: Post) => void;
  openTipSummary: (post: Post) => void;
  clearTipSummary: () => void;
};

export const useTipSummaryHook = (): TipSummaryHookProps => {
  const dispatch = useDispatch();

  const {loading, post, show, transactions, meta} = useSelector<RootState, TipSummaryState>(
    state => state.tipSummaryState,
  );

  const openTipSummary = (post: Post): void => {
    dispatch(setTippedPost(post));
  };

  const loadNextTransaction = async (post: Post): Promise<void> => {
    if (!loading) {
      await loadTransaction(post, meta.currentPage + 1);
    }
  };

  const loadTransaction = async (post: Post, page?: number): Promise<void> => {
    const currentPage = page ? page : meta.currentPage;

    dispatch(fetchTransactionHistory(post, currentPage));
  };

  const clearTipSummary = (): void => {
    dispatch(clearTippedPost());
  };

  return {
    meta,
    show,
    post,
    transactions,
    loadTransaction,
    loadNextTransaction,
    openTipSummary,
    clearTipSummary,
  };
};
