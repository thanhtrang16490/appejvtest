package database

import (
	"github.com/appejv/appejv-api/internal/config"
	"github.com/supabase-community/supabase-go"
)

type Database struct {
	Client *supabase.Client
}

func NewSupabaseClient(cfg *config.Config) *Database {
	client, err := supabase.NewClient(cfg.SupabaseURL, cfg.SupabaseAnonKey, &supabase.ClientOptions{})
	if err != nil {
		panic(err)
	}

	return &Database{
		Client: client,
	}
}
