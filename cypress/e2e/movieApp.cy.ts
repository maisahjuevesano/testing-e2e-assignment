import { IOmdbResponse } from "../../src/ts/models/IOmdbResponse";

const fakeData: IOmdbResponse = {
  Search: [
    {
      Title: "Star Wars IV",
      imdbID: "31841",
      Type: "text",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BOTA5NjhiOTAtZWM0ZC00MWNhLThiMzEtZDFkOTk2OTU1ZDJkXkEyXkFqcGdeQXVyMTA4NDI1NTQx._V1_SX300.jpg%22",
      Year: "1977",
    },
    {
      Title: "The Lord of the Rings",
      imdbID: "94752",
      Type: "text",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg%22",
      Year: "2001",
    },
    {
      Title: "Harry Potter III",
      imdbID: "18463",
      Type: "text",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BMGVmMWNiMDktYjQ0Mi00MWIxLTk0N2UtN2ZlYTdkN2IzNDNlXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg%22",
      Year: "2001",
    },
  ],
};

beforeEach(() => {
  cy.visit("/");
});

describe("testing movie application", () => {
  //handlar om vår index.html
  it("should have title", () => {
    cy.get("Title").contains("Async testing");
  });

  it("should find button", () => {
    //kontrollerar index.html
    cy.get("input").type("Harry");
    cy.get("button").click(); //när vi klickar kontrollerar vi att när vi klickar hämtar den riktig data.
    cy.get("div#movie-container>div.movie").should("have.length", 10);
  });

  it("should get 3 movie divs", () => {
    //borde jag ha den här?
    cy.intercept("GET", "http://omdbapi.com/*", fakeData);
    cy.get("button").click();
    cy.get("div.movie").should("have.length", 3);
  });

  it("should get 3 headings", () => {
    cy.intercept("GET", "http://omdbapi.com/*", fakeData);
    cy.get("form").submit();
    cy.get("div.movie > h3").should("have.length", 3);
  });

  it("should get 3 img", () => {
    cy.intercept("GET", "http://omdbapi.com/*", fakeData);
    cy.get("form").submit();
    cy.get("div.movie > img").should("have.length", 3);
  });

  it("should not get data", () => {
    cy.intercept("GET", "http://omdbapi.com/*", {}); //måsvingen är en tom mall
    cy.get("button").click();
    cy.get("p").contains("Inga sökresultat att visa");
    cy.get("div.movie").should("have.length", 0);
  });

  it("should be able to type in input", () => {
    cy.intercept("GET", "http://omdbapi.com/*", fakeData);
    cy.get("input").type("Harry Potter").should("have.value", "Harry Potter");
    cy.get("form").submit();
  });

  it("should be able to type in input", () => {
    cy.intercept("GET", "http://omdbapi.com/*", fakeData);
    cy.get("input")
      .type("The Lord of the Rings")
      .should("have.value", "The Lord of the Rings");
  });

  it("should have Batman in title", () => {
    cy.intercept("GET", "http://omdbapi.com/*", fakeData);

    cy.get("form").submit();

    cy.get("div.movie:first > h3").contains("Star");
  });

  it("should be able to click search", () => {
    cy.intercept("GET", "http://omdbapi.com/*", fakeData);
    cy.get("input").type("Harry Potter").should("have.value", "Harry Potter");
    cy.get("button").click();
    cy.get("div#movie-container > div").should("have.class", "movie");
    cy.get("div.movie").contains("<h3>", "<img>");
  });

  it("should have lenght 0", () => {
    cy.intercept("GET", "http://omdbapi.com/*", {});
    cy.get("form").submit();
    cy.get("div#movie-container > div.movie").should("have.length", 0);
  });

  it("should get <p/>Inga sökresultat att visa</p>", () => {
    cy.intercept("GET", "http://omdbapi.com/*", {});
    cy.get("form").submit();
    cy.get("p").contains("Inga sökresultat att visa");
  });

  it("should search by pressing enter instead of klicking searchbutton", () => {
    cy.intercept("GET", "http://omdbapi.com/*", fakeData);
    cy.get("input").type("Harry Potter").should("have.value", "Harry Potter");
  });
  it("should search with one word written", () => {
    cy.intercept("GET", "http://omdbapi.com/*", fakeData);
    cy.get("input").type("Die").should("have.value", "Die");
  });

  it("should give me message Inga sökresultat att visa", () => {
    cy.intercept("GET", "http://omdbapi.com/*", fakeData);
    cy.get("input#searchText").should("be.empty");
    cy.get("button#search").submit();
    cy.get("div#movie-container>p").should(
      "contain",
      "Inga sökresultat att visa"
    );
  });
});
