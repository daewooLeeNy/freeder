interface Window {
  chrome: {
    runtime: {
      sendMessage: (option: any) => void;
    };
  };
}
