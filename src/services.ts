import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { GerbangResponse, LoginResponse, lanlinResponse } from "./utils/types";

const BASE_URL = "http://localhost:8080/api";

export const fetchGerbangs = async (): Promise<GerbangResponse> => {
  const response = await axios.get(`${BASE_URL}/gerbangs`);
  return response.data;
};

export const useGerbangs = () => {
  return useQuery<GerbangResponse, Error>({
    queryKey: ["gerbangs"],
    queryFn: fetchGerbangs,
  });
};

export const fetchLalin = async (tanggal: string): Promise<lanlinResponse> => {
  const response = await axios.get(`${BASE_URL}/lalins?tanggal=${tanggal}`, {});
  return response.data;
};

export const useLalinData = (
    tanggal: string
) => {
  return useQuery<lanlinResponse, Error>({
    queryKey: ["pages", tanggal],
    queryFn: () => fetchLalin(tanggal),
  });
};
// Login Function
export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const response = await axios.post(`${BASE_URL}/auth/login`, {
    username,
    password,
  });
  return response.data;
};

export const useLogin = () => {
  return useMutation<
    LoginResponse,
    Error,
    { username: string; password: string }
  >({
    mutationFn: ({ username, password }) => login(username, password),
  });
};
