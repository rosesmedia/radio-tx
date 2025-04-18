{
  description = "roses radio streaming software";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    crane.url = "github:ipetkov/crane";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, crane, ... }:
    {
      overlays.default = final: prev: {
        inherit (self.packages.${prev.system}) selector;
      };
    } // flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };

        deps = with pkgs; [
        ] ++ pkgs.lib.optionals pkgs.stdenv.isDarwin [
          pkgs.libiconv
        ];

        craneLib = crane.mkLib pkgs;
      in
      {
        devShells.default = craneLib.devShell {
          packages = with pkgs; [
            rust-analyzer
            mpv
            ffmpeg_6
            liquidsoap
            yarn-berry
            ansible
            sshpass
          ] ++ deps;

          PRISMA_QUERY_ENGINE_LIBRARY = "${pkgs.prisma-engines}/lib/libquery_engine.node";
          PRISMA_QUERY_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/query-engine";
          PRISMA_SCHEMA_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/schema-engine";
        };
      });
}
