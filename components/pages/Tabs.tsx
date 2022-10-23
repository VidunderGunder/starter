import { Redirect, Route } from "react-router-dom";
import {
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
} from "@ionic/react";
import { flash } from "ionicons/icons";

import Home from "./Home";
import { css } from "styled-components";
import { ComponentPropsWithoutRef } from "react";

type TabProps = Pick<
  ComponentPropsWithoutRef<typeof Route>,
  "path" | "render"
> &
  Pick<ComponentPropsWithoutRef<typeof IonIcon>, "icon">;

const tabs: TabProps[] = [
  {
    path: "/feed",
    render: () => <Home />,
    icon: flash,
  },
  // Add tab here, and a tab bar will appear
];

export default function Tabs() {
  return (
    <IonTabs
      css={css`
        ion-tab-bar {
          --background: transparent;
          border: none;
        }
      `}
    >
      <IonRouterOutlet>
        {tabs.map((tab, index) => (
          <Route key={index} path={`/tabs${tab.path}`} render={tab.render} />
        ))}
        <Route
          path="/tabs"
          render={() => <Redirect to="/tabs/feed" />}
          exact={true}
        />
      </IonRouterOutlet>
      <IonTabBar slot="bottom" hidden={tabs.length === 1}>
        {tabs.map((tab, index) => (
          <IonTabButton
            key={index}
            tab={`tab${index}`}
            href={`/tabs${tab.path}`}
          >
            <IonIcon icon={tab.icon} />
          </IonTabButton>
        ))}
      </IonTabBar>
    </IonTabs>
  );
}
