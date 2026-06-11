import { FETCH_TIMEOUT_MICROSECOND } from '../configs';
import { Fetcher } from '../fetcher';

const clientFetcher = new Fetcher('', FETCH_TIMEOUT_MICROSECOND);
export { clientFetcher };
