import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  Image,
  View,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { getLatestGames } from "../lib/metacritic";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ContentLoader, { Rect } from "react-content-loader/native";
import { useNavigation } from "@react-navigation/native";

export function Main() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const fetchGames = async () => {
    try {
      setLoading(true);
      const latestGames = await getLatestGames();
      setGames(latestGames);
    } catch (error) {
      console.error("Error fetching games:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGames();
    setRefreshing(false);
  };

  const SkeletonCard = () => (
    <ContentLoader
      speed={1.5}
      width={375}
      height={160}
      backgroundColor="#94a3b8"
      foregroundColor="#444"
    >
      <Rect x="0" y="0" rx="10" ry="10" width="107" height="147" />
      <Rect x="130" y="0" rx="5" ry="5" width="200" height="20" />
      <Rect x="130" y="30" rx="5" ry="5" width="150" height="15" />
      <Rect x="130" y="55" rx="5" ry="5" width="180" height="15" />
      <Rect x="130" y="80" rx="5" ry="5" width="140" height="15" />
    </ContentLoader>
  );

  return (
    <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <View key={index} style={styles.card}>
                <SkeletonCard />
              </View>
            ))
          : games.map((game) => (
              <TouchableOpacity
                key={game.slug}
                style={styles.card}
                onPress={() => navigation.navigate('GameDetail', { game })}
              >
                <Image source={{ uri: game.image }} style={styles.image} />
                <View style={styles.infoContainer}>
                  <View style={styles.scoreContainer}>
                    <Text style={styles.score}>{game.score}</Text>
                  </View>
                  <Text style={styles.title}>{game.title}</Text>
                  <Text style={styles.description} numberOfLines={3}>
                    {game.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    alignItems: "center",  // Center items horizontally
    padding: 20,     // Space at the bottom
    backgroundColor: "#0f172a",
  },
  card: {
    marginBottom: 20,
    width: 375,
    backgroundColor: "#1e293b",
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  image: {
    width: 107,
    height: 147,
    borderRadius: 10,
    marginRight: 15,
  },
  scoreContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  score: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
    color: "#fff",
  },
  description: {
    fontSize: 16,
    color: "#94a3b8",
    marginTop: 5,
  },
});
