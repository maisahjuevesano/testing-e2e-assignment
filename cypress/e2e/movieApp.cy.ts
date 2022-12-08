import { fakeData } from "../../src/ts/services/__mocks__/movieservice";

beforeEach(() => {
  cy.visit("/");
});

describe("testing movie application", () => {
  it("should have title", () => {
    cy.get("Title").contains("Async testing");
  });

  it("should find button", () => {
    cy.get("button").should("have.id", "search");
  });

  it("should be able to click button", () => {
    cy.get("input").type("Harry");
    cy.get("button").click(); //när vi klickar kontrollerar vi att när vi klickar hämtar den riktig data.
    cy.get("div#movie-container>div.movie").should("have.length", 10);
  });

  it("should get 3 movie divs", () => {
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
    cy.intercept("GET", "http://omdbapi.com/*", fakeData).as("movieCall");
    cy.get("button").click();
    cy.wait("@movieCall").its("request.url");
    cy.get("input").type("Die").should("have.value", "Die");
  });

  it("should give me message Inga sökresultat att visa", () => {
    cy.intercept("GET", "http://omdbapi.com/*", {});
    cy.get("input#searchText").should("be.empty");
    cy.get("button#search").click();
    cy.get("div#movie-container > p").contains("Inga sökresultat att visa");
  });

  it("should give me message Inga sökresultat att visa if letters are less than 3", () => {
    cy.intercept("GET", "http://omdbapi.com/*", {});
    cy.get("input#searchText").type("ab");
    cy.get("button#search").click();
    cy.get("div#movie-container > p").contains("Inga sökresultat att visa");
  });

  it("should be the correct url call", () => {
    cy.get("input").type("Harry").should("have.value", "Harry");
    cy.intercept("GET", "http://omdbapi.com/*", fakeData).as("movieCall");
    cy.get("button").click();
    cy.wait("@movieCall").its("request.url").should("contain", "Harry");
  });
});
