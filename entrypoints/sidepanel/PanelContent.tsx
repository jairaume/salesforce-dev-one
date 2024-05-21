import Header from '@/components/Header';
import { Button, Grid, Page, Tree, useTheme } from '@geist-ui/core'
import { TreeFile } from '@geist-ui/core/esm/tree';

const files: TreeFile[] = [{
    type: 'directory',
    name: 'controllers',
    extra: '1 file',
    files: [{
      type: 'file',
      name: 'cs.js',
      extra: '1kb',
    }],
  }, {
    type: 'directory',
    name: 'docs',
    extra: '2 files',
    files: [{
      type: 'file',
      name: 'controllers.md',
      extra: '2.5kb',
    }, {
      type: 'file',
      name: 'es6.md',
      extra: '2.9kb',
    }],
  }, {
     type: 'file',
     name: 'production.md',
     extra: '0.8kb',
   }, {
     type: 'file',
     name: 'views.md',
     extra: '8.1kb',
   }]

const PanelContent  = ()=>{
    const { palette } = useTheme()

    const handler = (path: string) => console.log(path)

    return(
        <Page style={{ backgroundColor: palette.background }} className='!w-full !py-4'>
            <Page.Header>
                <Header colored={true}/>
            </Page.Header>

            <Page.Content>
                <Tree value={files} onClick={handler}/>
            </Page.Content>

            <Page.Footer className='left-0'>
                <Grid.Container className='px-4 py-2'>
                    <Grid>
                        <Button placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            Open File
                        </Button>
                    </Grid>
                </Grid.Container>
            </Page.Footer>
        </Page>
    )
}

export default PanelContent;