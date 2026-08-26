# Pokédex

A small Pokédex app built with **Expo (SDK 54)**, **React Native**, and **TypeScript**.

**I'm a native iOS developer.** I build apps in Swift, and this is my first proper attempt at React
Native — a deliberately small project, so I could concentrate on how the framework thinks instead of
on the problem domain. I wanted hands-on time with the current toolchain rather than another article
about it.

The app fetches Pokémon from the [PokéAPI](https://pokeapi.co/) and renders them as a scrollable list
of type-coloured cards that you can tap through to a detail screen. It is very much a work in
progress, and I'm keeping it public as a record of what I've figured out so far.

## What it does

- Fetches the first 30 Pokémon from PokéAPI, then fans out a second request per Pokémon to get the
sprites and types that the list endpoint doesn't include.
- Renders each one as a card showing its name, primary type, and both the front and back sprites.
- Tints each card using a lookup table of the 18 official Pokémon type colours.
- Navigates to a detail screen via a typed route, passing the Pokémon's name as a route param.

## Stack


| Piece      | Choice                                      |
| ---------- | ------------------------------------------- |
| Framework  | Expo SDK 54 (React Native 0.81, React 19.1) |
| Navigation | Expo Router 6 (file-based)                  |
| Language   | TypeScript, `strict` mode                   |
| Data       | PokéAPI, plain `fetch`                      |
| Targets    | iOS, Android, and web                       |


Typed routes and the React Compiler are both switched on in `app.json` under `experiments`.

## Running it

Requires Node 20.19 or newer, which is the minimum for SDK 54.

```bash
npm install
npx expo start
```

From there you can open the app in [Expo Go](https://expo.dev/go), an
[iOS simulator](https://docs.expo.dev/workflow/ios-simulator/), an
[Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/), or the browser. There
are also shortcuts for each platform:

```bash
npm run ios
npm run android
npm run web
```

## Project layout

```
src/app/
  _layout.tsx   Root stack navigator, sets the titles for both screens
  index.tsx     Pokémon list, fetches from PokéAPI and renders the cards
  details.tsx   Detail screen, reads the name route param and refetches
```

Routing is file-based, so each file in `src/app` is a screen and the filename is the route.
The `@/*` path alias maps to `src/*`.

## What it's like coming from Swift

Notes to myself, mostly framed against the iOS equivalents I already knew:

- **Navigation is the filesystem.** Dropping a file into `src/app` is the entire registration step —
no storyboard, no `UINavigationController` wiring, no segue identifiers. `_layout.tsx` is the
closest thing to a navigation controller, and it's where per-screen options like titles and
back-button behaviour are declared.
- **You pass identifiers between screens, not objects.** Where I'd normally hand a model straight to
the next view controller, here `Link` takes a `href` with `pathname` and `params`, and the
destination reads them back with `useLocalSearchParams`. Params arrive as strings, so I pass the
Pokémon's name and refetch on the detail screen. It feels closer to deep-linking than to a segue,
which makes sense once you realise every screen is a URL.
- **The UI layer reads like SwiftUI, not UIKit.** State drives the render and the view is a function
of that state, so `useState` and `useEffect` map reasonably well onto `@State` and `.task`. The
adjustment was that a component re-runs top to bottom on every state change, rather than me
imperatively mutating a view I'm holding a reference to.
- **No Auto Layout, no CSS either.** Styles are plain JavaScript objects, and layout is flexbox by
default rather than constraints. `StyleSheet.create` for anything reused, inline objects for values
that depend on data — like deriving a card's tint from its Pokémon type, which is far less
ceremony than the same thing in UIKit.
- `**async`/`await` transfers directly.** It behaves close enough to Swift concurrency that this part
needed no relearning. `Promise.all` is doing roughly the job of a task group: PokéAPI's list
endpoint returns only names and URLs, so sprites and types need one follow-up request each, and
fanning them out in parallel beats awaiting them in a loop.
- **The whole loop is faster.** Save the file, see it on the simulator, no build step in between.
That's the single biggest day-to-day difference from a Swift project of this size.

## Known rough edges

Being honest about what isn't done, since these are the next things I want to fix:

- The detail screen only renders the first ability and will throw once data arrives if a Pokémon
has none. It needs a real layout, plus loading and error states.
- Neither screen has a loading indicator or error UI — failures currently just `console.log`.
- The list uses a `ScrollView`, which renders every card at once. `FlatList` would be the right
call as the list grows.
- Card background colours are built by appending `"50"` to a hex string, which is a hacky way to
get transparency and only works because the values are all six-digit hex.
- Only the first type is displayed, so dual-type Pokémon lose information.
- No tests yet.

## Credits

Pokémon data and sprites come from the [PokéAPI](https://pokeapi.co/). Pokémon and its names are
trademarks of Nintendo, Game Freak, and The Pokémon Company; this project is a non-commercial
learning exercise and isn't affiliated with them.

Bootstrapped with `[create-expo-app](https://www.npmjs.com/package/create-expo-app)` and released
under the [MIT License](./LICENSE).