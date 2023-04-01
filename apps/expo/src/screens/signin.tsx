import React from "react";

import { View, SafeAreaView } from "react-native";

import SignInWithOAuth from "../components/SignInWithOAuth";

export const SignInSignUpScreen = () => {
  return (
    <SafeAreaView className="to-[[hsl(280,100%,70%)] bg-[#2e026d] bg-gradient-to-b from-[#6615d7] ">
      <View className="h-full w-full p-4">
        <SignInWithOAuth />
      </View>
    </SafeAreaView>
  );
};
