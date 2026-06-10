import { BASE_URL, FETCH_TIMEOUT_SECOND } from '../configs';
import { Fetcher } from '../fetcher';

const serverFetcher = new Fetcher(BASE_URL, FETCH_TIMEOUT_SECOND);
export { serverFetcher };
