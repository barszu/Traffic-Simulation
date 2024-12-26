# Traffic Simulation Project

[🇬🇧 English version here](README_eng.md)

## Opis projektu

Projekt symulacji ruchu drogowego, który modeluje zachowanie pojazdów na skrzyżowaniach z sygnalizacją świetlną. Projekt zawiera różne klasy i moduły do zarządzania węzłami drogowymi, krawędziami, symulacjami oraz presetami.

Skrzyżowanie zostało przedstawione jako zbiór wierzchołków oraz krawędzi, może przybierać `dowolny kształt` (ilość pasów jezdnych, kierunki jazdy)

### Używane nazewnictwo

-   zbiór wierzchołków - pasy dojazdowe, zjazdowe ze skrzyżowania
-   krawędzie - linia / tor jazdy

### Przykład

> dla skrzyżowania (presets/preset1.json):

![preset1](docs_img\preset1A.jpg)

> Jest przedstawione jako:

![preset1](docs_img\preset1B.jpg)

## Działanie

1. Przygotowanie konfiguracji skrzyżowania (przykład: `presets/preset1.json`):

    - Określenie wierzchołków oraz krawędzi opisujących skrzyżowanie.
    - Dla poprawnego działania symulacji (bez kolizji torów jezdnych) należy podać kolizje krawędzi. Wystarczy jednostronna relacja, program automatycznie utworzy dwustronną (jeśli A wyklucza B, to B będzie wykluczać A).

2. Ewentualna zmiana parametrów:

    - Czas trwania jednej fazy świateł.
    - Maksymalna liczba faz świateł, po której aktualnie występujący sygnał świetlny musi się zmienić.
    - Maksymalna liczba faz oczekiwania na zmianę świateł.

3. Wczytanie konfiguracji:

    - Sprawdzenie poprawności podanej konfiguracji. W przypadku błędu program zakończy działanie (src/main.ts).

4. Podział krawędzi na grupy, gdzie w obrębie danej grupy nie występują kolidujące ze sobą krawędzie.

5. Symulacja:

    - Przełączanie pomiędzy grupami.
    - Zielone światło zapala się dla kierunków jazdy (krawędzi) w danej grupie, a czerwone dla pozostałych.
    - Żółte światło zapala się w grupie, która właśnie została zmieniona oraz w grupie, która właśnie została aktywowana.

### Symulacja uwzględnijąca ilość oczekujących pojazdów

1. Pobranie informacji o liczbie samochodów oczekujących w wierzchołkach w obrębie grupy krawędzi (wierzchołki początkowe).
2. Usunięcie aktywnej grupy z rozważań, jeśli jest aktywna zbyt długo.
3. Sprawdzenie specjalnego scenariusza:

    > Uwzględnienie jedynie grup, które zbyt długo czekają na zmianę świateł.

4. Wybór grupy z największą liczbą samochodów.

Bardzo ważne jest dobranie odpowiednich parametrów dla zmiany świateł.

## Wyróżnione miejsca w projekcie

-   `src/`
    -   `appconfig/`
        -   `driving.ts` - Konfiguracja symulacji ruchu drogowego.
    -   `graph/`
        -   `independentSet.ts` - Funkcje do obliczania niezależnych zbiorów w grafie.
    -   `simulations/`
        -   `AbstractSimulation.ts` - Abstrakcyjna klasa reprezentująca symulację ruchu drogowego.
        -   `BasicSimulation.ts` - Klasa reprezentująca podstawową symulację ruchu drogowego.
        -   `AdvancedSimulation.ts` - Klasa reprezentująca zaawansowaną symulację ruchu drogowego.
    -   `Direction.ts` - Enum reprezentujący cztery główne kierunki.
    -   `Edge.ts` - Klasa reprezentująca połączenie drogowe (krawędź) między dwoma węzłami drogowymi.
    -   `RoadNode.ts` - Klasa reprezentująca węzeł drogowy (pas drogowy).
    -   `main.ts` - Główna funkcja uruchamiająca symulację.

## Uruchomienie

1. Instalacja

```bash
npm install
```

2. Program

```bash
npm run main
```

3. Testy

```bash
npm run test
```

## O aplikacji

Aplikacja została napisana głównie obiektowo, z dobrym podziałem odpowiedzialności pomiędzy klasami (poziom abstrakcji).

Sterowanie odbywa się poprzez statycznie zdefiniowane komendy w presecie, jednak mogą one być również podawane strumieniowo do aplikacji.

Algorytm przełączania pomiędzy grupami jest bardzo szybki (ma niską złożoność obliczeniową).

Algorytm doboru grup może być swobodnie modyfikowany (np. dodawanie automatycznie kolidujących krawędzi, jeśli łączą je jakieś cechy). Jest on bardziej wymagający niż algorytm przełączania, ale wykonywany jest tylko raz.

-   Złożoność O(V^3), gdzie V to liczba wierzchołków.

Projekt pozwala na bardzo prostą modyfikację i utrzymanie kodu, dodatkowo zawiera testy. Umożliwia utworzenie dowolnego skrzyżowania z drogami z max. 4 kierunków, lecz jest to również łatwo modyfikowalne - wystarczy dodać kolejny kierunek w `src\Direction.ts`.

Do stanu symulacji mamy bardzo prosty dostęp, wywołując deklaratywne metody, które uruchamiają odpowiednie callbacki w odpowiednich sytuacjach (np. zmiana świateł). Ta funkcjonalność umożliwia łatwą integrację z backendem czy frontendem.

Krawędzie i wierzchołki są singletonami, więc krawędź np. N1 -> E1 oraz wierzchołki N1, E1 występują raz w programie, aby zmniejszyć poziom trudności obsługi kodu.

### Przykład uruchomienia

> `presets\preset1.json`

```pl


Initial state
{
  recentActiveGroup: [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ],
  recentActiveFazeTime: 0,
  waitingTimeForGroup: Map(2) {
    [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 0,
    [ 'S2 -> W1' ] => 0
  },
  carsInGroups: Map(2) {
    [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 0,
    [ 'S2 -> W1' ] => 0
  }
}
Car added to:  S2
Map(2) {
  [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 1,
  [ 'S2 -> W1' ] => 1
}
Car added to:  N2
Map(2) {
  [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 2,
  [ 'S2 -> W1' ] => 1
}
Car added to:  N2
Map(2) {
  [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 3,
  [ 'S2 -> W1' ] => 1
}
Car added to:  N2
Map(2) {
  [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 4,
  [ 'S2 -> W1' ] => 1
}
Car added to:  N2
Map(2) {
  [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 5,
  [ 'S2 -> W1' ] => 1
}
Car added to:  N2
Map(2) {
  [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 6,
  [ 'S2 -> W1' ] => 1
}
Car added to:  N2
Map(2) {
  [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 7,
  [ 'S2 -> W1' ] => 1
}
Car added to:  N2
Map(2) {
  [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 8,
  [ 'S2 -> W1' ] => 1
}
Car added to:  N2
Map(2) {
  [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 9,
  [ 'S2 -> W1' ] => 1
}
Light stay
Light stay
Car added to:  S2
Map(2) {
  [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 2,
  [ 'S2 -> W1' ] => 1
}
Car added to:  S2
Map(2) {
  [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 3,
  [ 'S2 -> W1' ] => 2
}
Light stay
Light stay
Lights changed
{
  recentActiveGroup: [ 'S2 -> W1' ],
  recentActiveFazeTime: 0,
  waitingTimeForGroup: Map(2) {
    [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 1,
    [ 'S2 -> W1' ] => 0
  },
  carsInGroups: Map(2) {
    [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 0,
    [ 'S2 -> W1' ] => 0
  }
}
Lights changed
{
  recentActiveGroup: [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ],
  recentActiveFazeTime: 0,
  waitingTimeForGroup: Map(2) {
    [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 0,
    [ 'S2 -> W1' ] => 1
  },
  carsInGroups: Map(2) {
    [ 'S2 -> N1', 'N2 -> S1', 'S2 -> E1' ] => 0,
    [ 'S2 -> W1' ] => 0
  }
}
Light stay

```
