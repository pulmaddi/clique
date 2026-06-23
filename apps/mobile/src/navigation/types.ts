export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Terms: undefined;
  Register: undefined;
  OtpVerify: { phone: string };
  Main: undefined;
  RitualBooking: { occasionId: string; title: string };
  LiveMeeting: { occasionInstanceId: string; title: string };
  HostProfile: { hostId: string };
  Subscribe: { hostId: string; hostName: string };
};

export type MainTabParamList = {
  Home: undefined;
  Rituals: undefined;
  Events: undefined;
  Inbox: undefined;
  Profile: undefined;
};
