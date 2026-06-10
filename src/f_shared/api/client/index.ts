import { FETCH_TIMEOUT_SECOND } from '../configs';
import { Fetcher } from '../fetcher';

const clientFetcher = new Fetcher('', FETCH_TIMEOUT_SECOND);
export { clientFetcher };
