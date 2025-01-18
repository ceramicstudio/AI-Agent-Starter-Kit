// Add this to the top of the file, so that it can reference the global.d.ts file
/// <reference path="../global.d.ts" />

const encryptData = async (to_encrypt: Uint8Array) => {
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
  const res = await Lit.Actions.encrypt({
    accessControlConditions,
    to_encrypt,
  });
  return res;
};

const go = async () => {
  if (!encryptRequest) {
    Lit.Actions.setResponse({
      response: JSON.stringify({
        message: "bad_request: invalid input",
        timestamp: Date.now().toString(),
      }),
    });
    return;
  }
  try {
    // new buffer to avoid error about shared buffer view
    const { ciphertext, dataToEncryptHash } = await encryptData(
      new Uint8Array(encryptRequest.toEncrypt)
    );
    Lit.Actions.setResponse({
      response: JSON.stringify({
        message: "Successfully encrypted data",
        ciphertext,
        dataToEncryptHash,
        timestamp: Date.now().toString(),
      }),
    });
  } catch (err) {
    Lit.Actions.setResponse({
      response: JSON.stringify({
        message: `Failed to encrypt data (${encryptRequest.toEncrypt}): ${err.message}`,
        timestamp: Date.now().toString(),
      }),
    });
  }
};

go();
