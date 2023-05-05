import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  Button,
} from 'react-native';
import {
  GAMBannerAd,
  BannerAdSize,
  TestIds,
  AdEventType,
  AppOpenAd,
  InterstitialAd,
  BannerAd,
  RewardedAd,
} from 'react-native-google-mobile-ads';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-7385058090428760/6909472712';

const bannerAdUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-7385058090428760/8137943843';

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});

const appOpenAd = AppOpenAd.createForAdRequest(TestIds.APP_OPEN, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});

const rewarded = RewardedAd.createForAdRequest(TestIds.GAM_REWARDED, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [loaded, setLoaded] = useState(false);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    rewarded.load();
    appOpenAd.load();
    setTimeout(() => {
      // navigation
      // navigation.replace('Home');
      appOpenAd.show();
    }, 10000);
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        console.log('checking: ', interstitial.loaded);
        setLoaded(true);
      },
    );

    // Start loading the interstitial straight away
    interstitial.load();

    // Unsubscribe from events on unmount
    return unsubscribe;
  }, []);

  // No advert ready to show yet
  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.appContainer} />
      <GAMBannerAd
        unitId={TestIds.BANNER}
        // unitId={'ca-app-pub-7385058090428760/8137943843'}
        sizes={[BannerAdSize.FULL_BANNER]}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
          keywords: ['fashion', 'clothing'],
        }}
      />

      <BannerAd
        unitId={bannerAdUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdOpened={() => {
          console.log('opened!');
        }}
        onAdClosed={() => {
          console.log('closed');
        }}
      />

      <Button
        title="Show INterstitial"
        onPress={() => {
          interstitial.show();
        }}
      />
      <Button
        title="Display Rewarded Ads"
        onPress={() => {
          rewarded.show();
        }}
      />
    </SafeAreaView>
  );
}

const screenDimensions = Dimensions.get('screen');

const styles = StyleSheet.create({
  appContainer: {
    height: screenDimensions.height - 300,
    width: screenDimensions.width,
    backgroundColor: 'pink',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
