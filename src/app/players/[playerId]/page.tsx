import { PlayerDetailPage } from '@pages/playerDetail';

interface PlayerPageProps {
  params: Promise<{ playerId: string }>;
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { playerId } = await params;

  return <PlayerDetailPage playerId={playerId} />;
}
