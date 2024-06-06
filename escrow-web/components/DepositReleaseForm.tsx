import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  VStack,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { parseUnits } from "ethers/lib/utils.js";
import { useAllowance, useApprove, useEscrowWrite } from "hooks/useEscrow";
import { useForm } from "hooks/useForm";
import { Address } from "wagmi";
import { parseEther } from "ethers/lib/utils.js";


interface Props {
  address: Address;
  token: Address;
}
export default function DepositReleaseForm({ address, token }: Props) {
  const { register, formState, reset, handleSubmit } = useForm<{
    deposit: string;
    message: string;
  }>();

  const approve = useApprove({ token });
  const allowance = useAllowance({ address, token });

  const deposit = useEscrowWrite({
    address,
    functionName: "deposit",
    onSuccess: () => reset(),
  });

  const release = useEscrowWrite({
    address,
    functionName: "release",
    onSuccess: () => reset(),
  });

  const depositAmount = parseUnits(formState.deposit || "0");

  const hasAllowance = formState.deposit
    ? allowance.data?.gte(depositAmount)
    : true;

  function handleApprove() {
    approve.write?.({
      recklesslySetUnpreparedArgs: [address, depositAmount],
    });
  }

  return (
    <Box
      as="form"
      mb={8}
      onSubmit={handleSubmit(({deposit: deposit_, message = "No Remarks"}) => {
        if (deposit_) {
          const args = [token, parseEther(deposit_ as string), message];
          return deposit.write?.({ recklesslySetUnpreparedArgs: args });
        }
        else {
          const args = [token, "Release"];
          return release.write?.({ recklesslySetUnpreparedArgs: args });
        }
      })}
    >
      <VStack align="stretch" mb={2}>
        <FormControl>
          <FormLabel>Deposit</FormLabel>
          <HStack>
            <Input
              type="number"
              name="deposit"
              placeholder="300"
              {...register("deposit")}
            />
            <Button
              w={64}
              onClick={handleApprove}
              disabled={
                hasAllowance ||
                !formState.deposit ||
                approve.isLoading ||
                allowance.isLoading
              }
              isLoading={approve.isLoading || allowance.isLoading}
            >
              {hasAllowance ? <CheckIcon /> : "Approve"}
            </Button>
          </HStack>
                <Button
        w="100%"
        type="submit"
        colorScheme={"blue"}
        variant={"ghost"}
        disabled={!hasAllowance || !(formState.deposit)}
      >
        Deposit
      </Button>
        </FormControl>
        <FormControl>
          <FormLabel>Release</FormLabel>
          <Input
            name="message"
            placeholder="Message..."
            {...register("message")}
          />
        </FormControl>
      </VStack>

      <Button
        w="100%"
        type="submit"
        colorScheme={"blue"}
        variant={"ghost"}
        disabled={!hasAllowance || !!(formState.deposit)}
      >
        Release
      </Button>
    </Box>
  );
}
