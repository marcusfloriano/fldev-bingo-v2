
import { useControls, Leva, button } from 'leva'
import { useEffect } from 'react'

export function Settings({}) {

    const sortedMusic = useControls({
        "Música no Sorteio": true
    })

    useEffect(() => {
        if((window as any).toggleSortedMusic) {
            (window as any).toggleSortedMusic(sortedMusic["Música no Sorteio"])    
        }
    }, [sortedMusic])

    useControls("Silvio Santos", {
            "1Milhão": button(() => (window as any).playSoundFromUI('silvio/silvio-1milhao.mp3')),
            "Eh Memo": button(() => (window as any).playSoundFromUI('silvio/silvio-e-memo.mp3')),
            "Está certo disso": button(() => (window as any).playSoundFromUI('silvio/silvio-esta-certo-disso.mp3')),
            "Não da mais": button(() => (window as any).playSoundFromUI('silvio/silvio-nao-da-mais.mp3')),
            "Ritmo de Festa": button(() => (window as any).playSoundFromUI('silvio/silvio-ritmo-de-festa.mp3')),
            "Rockiie": button(() => (window as any).playSoundFromUI('silvio/silvio-rocke.mp3')),
            "Voce tem certeza": button(() => (window as any).playSoundFromUI('silvio/silvio-voce-tem-certeza.mp3')),
            "Voce está certo disso": button(() => (window as any).playSoundFromUI('silvio/sivio-estacerto.mp3')),
            "Qual o nome da música": button(() => (window as any).playSoundFromUI('silvio/sivio-nomemusica.mp3')),
            "Risada": button(() => (window as any).playSoundFromUI('silvio/sivio-risada.mp3'))
        }, {collapsed: true})

    useControls("Chaves", {
            "Apanha": button(() => (window as any).playSoundFromUI('chaves/chaves-apanha.mp3')),
            "Risada Auditorio": button(() => (window as any).playSoundFromUI('chaves/chaves-auditorio.mp3')),
            "Morrer": button(() => (window as any).playSoundFromUI('chaves/chaves-eu-prefiro-morrer.mp3')),
            "Isso isso isso": button(() => (window as any).playSoundFromUI('chaves/chaves-isso-isso.mp3')),
            "Kiko Carinho, Tesouro": button(() => (window as any).playSoundFromUI('chaves/chaves-kiko-carinho.mp3')),
            "Musica": button(() => (window as any).playSoundFromUI('chaves/chaves-musica.mp3')),
            "Não se inrrite": button(() => (window as any).playSoundFromUI('chaves/chaves-naoseinrrite.mp3')),
            "Pipipi": button(() => (window as any).playSoundFromUI('chaves/chaves-pipipi.mp3')),
        }, {collapsed: true})

    useControls("Faustão", {
            "Acertou": button(() => (window as any).playSoundFromUI('faustao/faustao-acertou.mp3')),
            "Errou": button(() => (window as any).playSoundFromUI('faustao/faustao-error.mp3')),
            "Hora de Alegria": button(() => (window as any).playSoundFromUI('faustao/faustao-hora-de-alegria.mp3')),
            "O loco Meu": button(() => (window as any).playSoundFromUI('faustao/faustao-olocomeu.mp3')),
            "Ninguém acertou": button(() => (window as any).playSoundFromUI('faustao/fausto-ningue-acertou.mp3')),

        }, {collapsed: true})

    useControls("Galvão Bueno", {
            "Haja Coração": button(() => (window as any).playSoundFromUI('galvao/galvao-hajacoracao.mp3')),
            "É Tetra": button(() => (window as any).playSoundFromUI('galvao/galvao-etreta.mp3')),
            "Gol da Alemanha": button(() => (window as any).playSoundFromUI('galvao/galvao-gol-alemanha.mp3')),
            "Olha o que Aconteceu": button(() => (window as any).playSoundFromUI('galvao/galvao-olhaoqueaconteceu.mp3')),
            "Tafarel": button(() => (window as any).playSoundFromUI('galvao/galvao-rafarel.mp3')),
            "Terminou": button(() => (window as any).playSoundFromUI('galvao/galvao-terminou.mp3')),

        }, {collapsed: true})

    useControls("Trecho de Música", {
            "Coração Parando": button(() => (window as any).playSoundFromUI('musica/musica-coracao-parando.mp3')),
            "Vai doer Vai doer": button(() => (window as any).playSoundFromUI('musica/musica-vaidorevaidoer.mp3')),
            "Zum zum zum": button(() => (window as any).playSoundFromUI('musica/musica-zumzumzum.mp3')),
        }, {collapsed: true})

    useControls("Meme", {
            "An ham sei": button(() => (window as any).playSoundFromUI('meme/meme-anham-sei.mp3')),
            "Para nossa Alegria": button(() => (window as any).playSoundFromUI('meme/meme-para-nossa-alegria.mp3')),
        }, {collapsed: true})
    return (
        <Leva collapsed={true} oneLineLabels={true} />
    )
}