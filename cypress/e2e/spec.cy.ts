import { IOmdbResponse } from "..//../src/ts/models/IOmdbResponse";

const fakeData: IOmdbResponse = {
  Search: [
    {
      Title: "Star Wars IV",
      imdbID: "31841",
      Type: "text",
      Poster: "poster",
      Year: "1977",
    },
    {
      Title: "The Lord of the Rings",
      imdbID: "94752",
      Type: "text",
      Poster: "poster",
      Year: "2001",
    },
    {
      Title: "Harry Potter III",
      imdbID: "18463",
      Type: "text",
      Poster: "poster",
      Year: "2001",
    },
  ],
};

describe("testing todo application", () => {
  //handlar om vår index.html
  it("should have title", () => {
    cy.visit("http://localhost:1234");
    cy.get("Title").contains("Async testing");
  });

  it("should have a button", () => {
    //kontrollerar index.html
    cy.visit("http://localhost:1234");
    // cy.intercept("GET", "http://omdbapi.com/*", fakeData);
    cy.get("input").type("Harry");
    cy.get("button").click(); //när vi klickar kontrollerar vi att när vi klickar hämtar den riktig data.
    cy.get("div#movie-container>div.movie").should("have.length", 10);
  });

  it("should not get data", () => {
    cy.intercept("GET", "http://omdbapi.com/*", {}); //måsvingen är en tom mall
    cy.get("button").click();
    cy.get("p").contains("Inga sökresultat att visa");
    cy.get("div.movie").should("have.length", 0);
  });

  it("should get data", () => {
    cy.intercept("GET", "http://omdbapi.com/*", fakeData); //måsvingen är en tom mall
    cy.get("button").click();
    cy.get("div.movie").should("have.length", 3);
  });

  it("should be able to type", () => {
    cy.visit("http://localhost:1234");
    cy.intercept("GET", "http://omdbapi.com/*", fakeData);
    cy.get("input").type("Harry Potter").should("have.value", "Harry Potter");
    cy.get("form").submit();
  });

  it("should be able to type", () => {
    cy.visit("http://localhost:1234");
    cy.intercept("GET", "http://omdbapi.com/*", fakeData);
    cy.get("input")
      .type("The Lord of the Rings")
      .should("have.value", "The Lord of the Rings");
  });

  it("should be able to click search", () => {
    cy.visit("http://localhost:1234/");
    cy.intercept("GET", "http://omdbapi.com/*", fakeData);
    cy.get("input").type("Harry Potter").should("have.value", "Harry Potter");
    cy.get("button").click();
    cy.get("div#movie-container > div").should("have.class", "movie");
    cy.get("div.movie").contains("<h3>", "<img>");
  });
});
