import axios from "axios";
import {BASE_URL} from "@/constants";
import { cacheAdapterEnhancer } from "axios-extensions";

export const http = axios.create({
  baseURL: BASE_URL,
  headers: { "Cache-Control": "no-cache" },
  // cache will be enabled by default
  adapter: cacheAdapterEnhancer(axios.defaults.adapter)
});
