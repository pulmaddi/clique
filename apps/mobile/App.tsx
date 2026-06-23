import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { colors } from './src/theme';
import { t } from './src/i18n';
import type { RootStackParamList, MainTabParamList } from './src/navigation/types';

import SplashScreen from './src/screens/SplashScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import TermsScreen from './src/screens/TermsScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import OtpVerifyScreen from './src/screens/OtpVerifyScreen';
import HomeScreen from './src/screens/HomeScreen';
import RitualsScreen from './src/screens/RitualsScreen';
import RitualBookingScreen from './src/screens/RitualBookingScreen';
import LiveMeetingScreen from './src/screens/LiveMeetingScreen';
import HostProfileScreen from './src/screens/HostProfileScreen';
import InboxScreen from './src/screens/InboxScreen';
import SubscribeScreen from './src/screens/SubscribeScreen';
import PlaceholderScreen from './src/screens/PlaceholderScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.saffron,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: t('tabs.home') }} />
      <Tab.Screen name="Rituals" component={RitualsScreen} options={{ title: t('tabs.rituals') }} />
      <Tab.Screen name="Events" component={PlaceholderScreen} options={{ title: t('tabs.events') }} />
      <Tab.Screen name="Inbox" component={InboxScreen} options={{ title: t('tabs.inbox') }} />
      <Tab.Screen name="Profile" component={PlaceholderScreen} options={{ title: t('tabs.profile') }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerStyle: { backgroundColor: colors.maroon },
            headerTintColor: colors.white,
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Terms" component={TermsScreen} options={{ title: 'Terms & Conditions' }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OtpVerify" component={OtpVerifyScreen} options={{ title: '' }} />
          <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="RitualBooking" component={RitualBookingScreen} options={{ title: 'Book Ritual' }} />
          <Stack.Screen name="LiveMeeting" component={LiveMeetingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="HostProfile" component={HostProfileScreen} options={{ title: '' }} />
          <Stack.Screen name="Subscribe" component={SubscribeScreen} options={{ title: 'Subscribe' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
