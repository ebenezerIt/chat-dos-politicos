import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-story-component',
    templateUrl: './story-component.component.html',
    styleUrls: ['./story-component.component.scss']
})
export class StoryComponent implements OnInit, AfterViewInit {
    stories = [{
        story: {
            name: "Quem Somos",
            logo: 'assets/images/story_logo.png'
        },
        stories: [
            {
                title: 'Quem Somos',
                description: 'O Chat é baseado em um sistema de Pontuação criado pelo Ranking dos Políticos, A pontuação dos políticos é definida de acordo com sua atuação no combate à corrupção, aos privilégios e ao desperdício da máquina pública. Para apurar isso, são avaliados os dados sobre presenças nas sessões, economia de verbas, processos judiciais e votações dos parlamentares nas decisões mais importantes do Congresso, saiba mais.',
                img: 'assets/images/story.png'
            },
            {
                title: 'Titulo',
                description: 'Descrição',
                img: 'assets/images/story.png'
            },
            {
                title: 'Titulo',
                description: 'Descrição',
                img: 'assets/images/story.png'
            },
        ]
    },
        {
            story: {
                name: "Votos",
                logo: 'assets/images/story.png'
            },
            stories: [{
                title: 'Titulo vai aqui',
                description: 'aqui tera uma descrição sobre o assunto',
                img: 'assets/images/story.png'
            },
            ]
        },
        {
            story: {
               name: "Gastos",
                logo: 'assets/images/story.png'
            },
            stories: [
                {
                    title: 'Quanto gasta um Senador',
                    description: 'No Chat você tem acesso aos gastos gerais de cada membro da câmara federal',
                    img: 'assets/images/story.png'
                },

            ]
        },
    ]

    loading = true;
    showStory = false;
    selectedStory: any;
    positionSelectedStory = 0;
    storySetTimeout: any;
    currentContentStoryIndex = 0;
    isStoryPaused = false;
    startSeconds?: Date;
    endSeconds?: Date;
    remainingSeconds = 0;
    timeout = 5000
    animation?: HTMLElement;
    animationZoom?: HTMLElement;

    constructor() {
    }

    skeletonStory = {
        'border-radius': '50%',
        height: '70px',
        width: '70px',
        'background-color': '#e1e1e1',
        margin: '0',
        border: '1px solid #d1d1d1'
    };

    ngOnInit(): void {
        setTimeout(() => {
            this.loading = false;
        }, 1000);
    }

    ngAfterViewInit() {
        this.animation = document.querySelector('div.progress-value') as HTMLElement;
        this.animationZoom = document.querySelector('div.progress-value') as HTMLElement;
    }

    activateTimeout(timeout = this.timeout): void {
        this.clearTimeout();
        this.startCountingSeconds();
        this.storySetTimeout = setTimeout(() => {
            this.nextStory();
            this.remainingSeconds = this.timeout;
        }, timeout)
    }

    clearTimeout(): void {
        clearTimeout(this.storySetTimeout)
    }

    onClickStory = (story: any, currentContentStoryIndex: number) => {
        this.selectedStory = story;
        this.showStory = true;
        this.currentContentStoryIndex = currentContentStoryIndex;
        this.remainingSeconds = this.timeout;
        this.activateTimeout();
    }

    onCloseStories = (): void => {
        this.showStory = false;
        this.positionSelectedStory = 0;
        this.isStoryPaused = false;
        this.clearTimeout();
    }

    onPlayStories = (): void => {
        this.isStoryPaused = false;
        this.activateTimeout(this.remainingTime());
        this.handleProgressBar();
    }

    onPauseStories = (): void => {
        this.isStoryPaused = true;
        this.endCountingSeconds();
        this.clearTimeout();
        this.handleProgressBar();
    }

    nextStory = (nextPage = false): void => {
        const currentStoryLength = this.selectedStory.stories.length;
        this.isStoryPaused = false;
        this.handleProgressBar();
        this.activateTimeout();
        if (this.positionSelectedStory < (currentStoryLength - 1) && !nextPage) {
            this.positionSelectedStory++;
        } else {
            this.checkNextStoryContent();
        }

        this.animationZoom = document.querySelector('div.story-mode') as HTMLElement
        this.animationZoom.classList.remove('animation')
    }

    previousStory = (previousPage = false): void => {
        this.isStoryPaused = false;
        this.handleProgressBar();
        this.activateTimeout();
        if (this.positionSelectedStory && !previousPage) {
            this.positionSelectedStory--;
        } else {
            this.checkPreviousStoryContent(previousPage);
        }

        this.animationZoom = document.querySelector('div.story-mode') as HTMLElement
        this.animationZoom.classList.remove('animation')
    }

    checkNextStoryContent = (): void => {
        const contentStoryLength = this.stories.length;
        if (this.currentContentStoryIndex < (contentStoryLength - 1)) {
            this.currentContentStoryIndex++;
            this.selectedStory = this.stories[this.currentContentStoryIndex];
            this.positionSelectedStory = 0;
        } else {
            this.showStory = false;
        }
        this.animationZoom = document.querySelector('div.story-mode') as HTMLElement
        this.animationZoom.classList.remove('animation')
    }

    checkPreviousStoryContent = (previousPage): void => {
        if (this.currentContentStoryIndex) {
            this.currentContentStoryIndex--;
            this.selectedStory = this.stories[this.currentContentStoryIndex];
            this.positionSelectedStory = previousPage ? 0 : this.selectedStory.stories.length - 1
        }
        this.animationZoom = document.querySelector('div.story-mode') as HTMLElement
        this.animationZoom.classList.remove('animation')
    }

    startCountingSeconds = (): void => {
        this.startSeconds = new Date();
    };

    endCountingSeconds = (): void => {
        this.endSeconds = new Date();
    }

    remainingTime = (): number => {
        if (this.startSeconds && this.endSeconds) {
            let timeDiff = this.endSeconds.getTime() - this.startSeconds.getTime();
            this.remainingSeconds = this.remainingSeconds - timeDiff;
            console.log('remainingSeconds')
            return this.remainingSeconds
        }
        return 0
    }

    handleProgressBar = (): void => {
        this.animation = document.querySelector('div.progress-value') as HTMLElement
        // this.animationZoom = document.querySelector('div.animation') as HTMLElement
        this.animation.style.animationPlayState = 'running';
        // this.animationZoom.style.animationPlayState = 'running';

        if (this.isStoryPaused) {
            this.animation.style.animationPlayState = 'paused';
            // this.animationZoom.style.animationPlayState = 'paused';
            // this.animationZoom.style.animation = 'paused';
        }
    }

}
