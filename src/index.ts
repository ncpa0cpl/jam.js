import { HTMLDomInterface as DI, VDOMComponent as VDC } from "./vdom/index.js";
import * as Locations from "./components/Locations/index.js";
import { Structure } from "./vdom/types.js";

class MainApp extends VDC {
  constructor(props: Object) {
    super(props);
  }

  render(): Structure {
    const mainpage = {
      type: "div",
      childs: [
        {
          type: "div",
          style: {
            display: "flex",
            flexDirection: "row",
          },
          childs: [
            {
              type: Locations.Link,
              props: {
                to: "/home/one",
                text: "1",
              },
            },
            {
              type: Locations.Link,
              props: {
                to: "/home/two",
                text: "2",
              },
            },
          ],
        },
        {
          type: Locations.Router,
          props: {
            routes: [
              {
                path: "one",
                page: { type: "p", content: "p1" },
                default: true,
              },
              {
                path: "two",
                page: { type: "p", content: "p2" },
              },
            ],
          },
        },
      ],
    };

    const aboutpage: Structure = {
      type: "div",
      childs: [
        {
          type: "p",
          content: "About page",
        },
      ],
    };

    console.log(aboutpage);

    return {
      type: "div",
      childs: [
        {
          type: Locations.RouterContext,
          props: {
            childs: [
              {
                type: "div",
                style: {
                  display: "flex",
                  flexDirection: "row",
                },
                childs: [
                  {
                    type: Locations.Link,
                    props: {
                      to: "/home",
                      text: "Home",
                    },
                  },
                  {
                    type: Locations.Link,
                    props: {
                      to: "/about",
                      text: "About",
                    },
                  },
                ],
              },
              {
                type: Locations.Router,
                props: {
                  routes: [
                    {
                      page: mainpage,
                      path: "home",
                      default: true,
                    },
                    {
                      page: aboutpage,
                      path: "about",
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    };
  }
}

DI.render(<HTMLElement>document.querySelector("#root")!, VDC.initiate({ type: MainApp }));
