import SongList from '@/widgets/songLists/ui/SongLists'
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
import './styles'
import AudioPlayer from '@/widgets/audioPlayer/ui/AudioPlayer'

export const App = () => {
  const platform = usePlatform()

  return (
    <AppRoot>
      <SplitLayout header={platform !== 'vkcom' && <PanelHeader delimiter="none" />}>
        <SplitCol autoSpaced>
          <View activePanel="main">
            <Panel id="main">
              <PanelHeader>VKUI</PanelHeader>
              <SongList />
              <AudioPlayer />
            </Panel>
          </View>
        </SplitCol>
      </SplitLayout>
    </AppRoot>
  )
}
