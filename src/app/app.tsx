import AudioPlayer from '@/widgets/audioPlayer/AudioPlayer'
import SongList from '@/widgets/songLists/SongLists'
import {
  AppRoot,
  SplitLayout,
  SplitCol,
  View,
  Panel,
  PanelHeader,
  Header,
  Group,
  SimpleCell,
  usePlatform
} from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css'

export const App = () => {
  const platform = usePlatform()

  return (
    <AppRoot>
      <SplitLayout header={platform !== 'vkcom' && <PanelHeader delimiter="none" />}>
        <SplitCol autoSpaced>
          <View activePanel="main">
            <Panel id="main">
              <PanelHeader>VKUI</PanelHeader>
              <AudioPlayer />
              <SongList />
            </Panel>
          </View>
        </SplitCol>
      </SplitLayout>
    </AppRoot>
  )
}
