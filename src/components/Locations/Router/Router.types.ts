import { Structure } from "../../../vdom/types";

interface Route {
  path: string;
  page: Structure;
  default?: boolean;
}

interface RouterProps {
  routes: Route[];
  errorPage?: Structure;
}

export { RouterProps };
