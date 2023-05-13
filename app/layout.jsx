import "@styles/globals.css";
import Nav from "@components/Nav";
import Provider from "@components/Provider";
import { FavoritesContextProvider } from "@components/FavoritesContextProvider";
export const metadata = {
  title: "Promptpedia",
  description: "Share and discover AI prompts.",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <Provider>
          <FavoritesContextProvider>
            <div className="main">
              <div className="gradient"></div>
            </div>
            <main className="app">
              <Nav />
              {children}
            </main>
          </FavoritesContextProvider>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
