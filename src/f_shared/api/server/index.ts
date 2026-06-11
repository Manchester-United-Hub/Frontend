import { BASE_URL, FETCH_TIMEOUT_MICROSECOND } from '../configs';
import { Fetcher } from '../fetcher';

const serverFetcher = new Fetcher(BASE_URL, FETCH_TIMEOUT_MICROSECOND);
export { serverFetcher };
