import { useMutation } from "@tanstack/react-query";
import { createSlip } from "../api/slip";

export function useCreateSlip() {
  return useMutation({
    mutationFn: createSlip,
  });
}
