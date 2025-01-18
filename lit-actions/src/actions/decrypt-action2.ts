// Add this to the top of the file, so that it can reference the global.d.ts file
/// <reference path="../global.d.ts" />

const go = async () => {
  if (!decryptRequest) {
    return null;
  }

  try {
    const decrypted = await Lit.Actions.decryptToSingleNode({
      accessControlConditions: decryptRequest.accessControlConditions,
      ciphertext: decryptRequest.ciphertext,
      dataToEncryptHash: decryptRequest.dataToEncryptHash,
      authSig: null,
      chain: decryptRequest.chain,
    });
    Lit.Actions.setResponse({
      response: JSON.stringify({
        message: "Successfully decrypted data",
        decrypted,
        timestamp: Date.now().toString(),
      }),
    });
    return decrypted;
  } catch (err) {
    Lit.Actions.setResponse({
      response: JSON.stringify({
        message: `failed to decrypt data: ${err.message}`,
        timestamp: Date.now().toString(),
      }),
    });
    return err.message;
  }
};

go();
