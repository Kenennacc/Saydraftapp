export default function Home() {
  return (
    <main>
      <header className="w-full min-h-screen pt-18">
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-4xl">
            The Future of Contracts Isn't Written — It's Spoken
          </h1>
          <p className="text-foreground/75 mt-1 text-lg max-w-[60%] text-center">
            Create, negotiate, and sign contracts with your voice. Speak
            naturally, in any language. Get AI-generated contracts instantly.
          </p>
        </div>

        <video
          src="/hero.mp4"
          className="rounded-3xl w-full h-auto aspect-video"
        ></video>
      </header>
    </main>
  );
}
