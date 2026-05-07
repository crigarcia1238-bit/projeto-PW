function inicializarDados() {
    if (!localStorage.getItem('conteudos') || JSON.parse(localStorage.getItem('conteudos')).length === 0) {
        const filmesIniciais = [
            { id: 1, titulo: "Inception", genero: "Sci-Fi", ano: "2010", descricao: "Um ladrão que rouba segredos através dos sonhos.", imagemUrl: "https://m.media-amazon.com/images/M/MV5BYTMxYjY1NzEtZTEyOC00ODc3LWE5YTItYWMzODkzMmIzZDI5XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg" },
            { id: 2, titulo: "The Joker", genero: "Drama", ano: "2019", descricao: "A origem do vilão de Gotham.", imagemUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQP7TzsGto_FJI2I9IibPV1GWd--ki-_NAAYQ&s" },
            { id: 3, titulo: "Interstellar", genero: "Sci-Fi", ano: "2014", descricao: "Viagem por um buraco de minhoca.", imagemUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu821UMnWYh9yytdhE1PDttUA40pI_6Be3hg&s" },
            { id: 4, titulo: "The Matrix", genero: "Ação", ano: "1999", descricao: "A realidade é uma simulação.", imagemUrl: "https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
            { id: 5, titulo: "Pulp Fiction", genero: "Crime", ano: "1994", descricao: "Crime em Los Angeles.", imagemUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxEtuBLjVeHf1xe-4BRLtXqGu36-1LBulPCQ&s" },
            { id: 6, titulo: "Dark Knight", genero: "Ação", ano: "2008", descricao: "Batman contra o Joker.", imagemUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSylAEpxgsKBSdGltLccu8u-Srkwbj3rtvxhA&s" },
            { id: 7, titulo: "Parasite", genero: "Thriller", ano: "2019", descricao: "Família pobre vs rica.", imagemUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ5IkvNT8H8gkFKGGEppZPaqxKtXazJ114Jw&s" },
            { id: 8, titulo: "The Godfather", genero: "Drama", ano: "1972", descricao: "A máfia Corleone.", imagemUrl: "https://upload.wikimedia.org/wikipedia/pt/a/af/The_Godfather%2C_The_Game.jpg" },
            { id: 9, titulo: "Avatar", genero: "Ação", ano: "2009", descricao: "Exploração de Pandora.", imagemUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_tMDmGpdUANiBhrYP30GLPrVvcNZed4sTeA&s" },
            { id: 10, titulo: "Shrek", genero: "Animação", ano: "2001", descricao: "Um ogre e o seu burro.", imagemUrl: "https://assetsio.gnwcdn.com/Shrek-5_BoqFqfi.png?width=1200&height=630&fit=crop&enable=upscale&auto=webp" }
        ];
        localStorage.setItem('conteudos', JSON.stringify(filmesIniciais));
    }
}
inicializarDados();