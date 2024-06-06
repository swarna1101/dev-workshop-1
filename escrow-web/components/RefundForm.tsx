import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { parseEther } from "ethers/lib/utils.js";
import { useEscrowWrite } from "hooks/useEscrow";
import { useForm } from "hooks/useForm";

export default function RefundForm({ address = "", token = "" }) {
  const { register, formState, reset, handleSubmit } = useForm<{
    message: string;
  }>();

  const { write, isLoading } = useEscrowWrite({
    address,
    functionName: "refund",
    onSuccess: () => reset(),
  });

  return (
    <form
      onSubmit={handleSubmit(({ message = "" }) => {
        const args = [token, message];
        write?.({ recklesslySetUnpreparedArgs: args });
      })}
    >
      <FormControl mb={2}>
        <FormLabel>Refund</FormLabel>
      </FormControl>
      <FormControl>
        <Input name="message" placeholder="Message" {...register("message")} />
      </FormControl>
      <Button
        w="100%"
        type="submit"
        variant={"ghost"}
        colorScheme={"blue"}
        isLoading={isLoading}
        disabled={isLoading}
      >
        Refund
      </Button>
    </form>
  );
}
