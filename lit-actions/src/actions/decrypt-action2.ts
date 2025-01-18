// Add this to the top of the file, so that it can reference the global.d.ts file
/// <reference path="../global.d.ts" />

const go = async () => {
  if (
    !decryptRequest ||
    !decryptRequest.ciphertext ||
    !decryptRequest.dataToEncryptHash ||
    !decryptRequest.chain
  ) {
    Lit.Actions.setResponse({
      response: JSON.stringify({
        message: `bad_request: missing input`,
        timestamp: Date.now().toString(),
      }),
    });
    return;
  }
  const accessControlConditions = [
    {
      contractAddress: "evmBasic",
      standardContractType: "",
      chain: "base",
      method: "eth_getBalance",
      parameters: [":userAddress", "latest"],
      returnValueTest: {
        comparator: "<=",
        value: "1000000000000000000", // 1 ETH
      },
    },
  ];

  try {
    const decrypted = await Lit.Actions.decryptToSingleNode({
      accessControlConditions,
      ciphertext: decryptRequest.ciphertext,
      dataToEncryptHash: decryptRequest.dataToEncryptHash,
      authSig: null,
      chain: decryptRequest.chain,
    });
    if (!decrypted) {
      return;
    }
    Lit.Actions.setResponse({
      response: JSON.stringify({
        message: "Successfully decrypted data",
        decrypted,
        timestamp: Date.now().toString(),
      }),
    });
  } catch (err) {
    Lit.Actions.setResponse({
      response: JSON.stringify({
        message: `failed to decrypt data: ${err.message}`,
        error: err,
        timestamp: Date.now().toString(),
      }),
    });
  }
};

go();
