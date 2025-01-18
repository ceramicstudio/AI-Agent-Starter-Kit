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
        message: `missing required input field`,
        input: decryptRequest,
        timestamp: Date.now().toString(),
      }),
    });
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
    if (!decrypted || decrypted.length == 0) {
      Lit.Actions.setResponse({
        response: JSON.stringify({
          message: "Decrypted data is empty even though it was successful",
          decryptRequest,
          timestamp: Date.now().toString(),
        }),
      });
    } else {
      Lit.Actions.setResponse({
        response: JSON.stringify({
          message: "Successfully decrypted data",
          decrypted: decrypted.toString(),
          timestamp: Date.now().toString(),
        }),
      });
    }
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
