CREATE TABLE "Category" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Category_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "Dialogue" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(500) NOT NULL,
	"audioUrl" varchar(1000),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Message" (
	"id" serial PRIMARY KEY NOT NULL,
	"originalText" text NOT NULL,
	"translatedText" text NOT NULL,
	"dialogueId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Phrase" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(500) NOT NULL,
	"translate" text NOT NULL,
	"transcription" text NOT NULL,
	"audioUrl" varchar(1000),
	"categoryId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"role" "role" DEFAULT 'USER' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "categories" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "dialogues" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "messages" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "phrases" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "categories" CASCADE;--> statement-breakpoint
DROP TABLE "dialogues" CASCADE;--> statement-breakpoint
DROP TABLE "messages" CASCADE;--> statement-breakpoint
DROP TABLE "phrases" CASCADE;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "favoritePhrases" DROP CONSTRAINT "favoritePhrases_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "favoritePhrases" DROP CONSTRAINT "favoritePhrases_phraseId_phrases_id_fk";
--> statement-breakpoint
ALTER TABLE "Message" ADD CONSTRAINT "Message_dialogueId_Dialogue_id_fk" FOREIGN KEY ("dialogueId") REFERENCES "public"."Dialogue"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Phrase" ADD CONSTRAINT "Phrase_categoryId_Category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favoritePhrases" ADD CONSTRAINT "favoritePhrases_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favoritePhrases" ADD CONSTRAINT "favoritePhrases_phraseId_Phrase_id_fk" FOREIGN KEY ("phraseId") REFERENCES "public"."Phrase"("id") ON DELETE no action ON UPDATE no action;