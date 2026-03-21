export type Theme = {
  colors: {
    background: string;
    text: string;
    primary: string;
  };
};

export const lightTheme = {
  colors: {
    background: "#ffffff",
    text: "#111111",
    card: "#f5f5f5",
    primary: "#6200ee",
  },
};

export const darkTheme = {
  colors: {
    background: "#111111",
    text: "#f1f1f1",
    card: "#1e1e1e",
    primary: "#bb86fc",
  },
};
