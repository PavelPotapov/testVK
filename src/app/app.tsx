import { SongList } from '@/widgets/songLists'
import {
  AppRoot,
  SplitLayout,
  SplitCol,
  View,
  Panel,
  PanelHeader,
  Div,
  usePlatform
} from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css'
import './styles'
import { AudioPlayer } from '@/features/audioPlayer'

export const App = () => {
  const platform = usePlatform()

  return (
    <AppRoot>
      <SplitLayout header={platform !== 'vkcom' && <PanelHeader delimiter="none" />}>
        <SplitCol autoSpaced>
          <View activePanel="main">
            <Panel id="main">
              <PanelHeader>VKUI</PanelHeader>
              <Div className="mainContainer">
                <SongList />
                <AudioPlayer />
              </Div>
            </Panel>
          </View>
        </SplitCol>
      </SplitLayout>
    </AppRoot>
  )
}
