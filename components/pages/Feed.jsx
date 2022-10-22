import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonMenuButton,
} from "@ionic/react";
import Notifications from "./Notifications";
import { useState } from "react";
import { notificationsOutline } from "ionicons/icons";
import { getHomeItems } from "../../store/selectors";
import Store from "../../store";

const FeedCard = ({ title, type, text, author, authorAvatar, image }) => (
  <div>Card</div>
);

const Feed = () => {
  const homeItems = Store.useState(getHomeItems);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Feed</IonTitle>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowNotifications(true)}>
              <IonIcon icon={notificationsOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Feed</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Notifications
          open={showNotifications}
          onDidDismiss={() => setShowNotifications(false)}
        />
        {homeItems.map((i, index) => (
          <FeedCard {...i} key={index} />
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Feed;
