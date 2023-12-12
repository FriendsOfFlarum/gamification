<?php

namespace FoF\Gamification\Tests;

use Flarum\Testing\integration\TestCase as BaseTestCase;
use Laminas\Diactoros\ServerRequest;
use Laminas\Diactoros\Stream;
use Laminas\Diactoros\UploadedFile;
use Psr\Http\Message\ServerRequestInterface;

class EnhancedTestCase extends BaseTestCase
{
    protected function request(string $method, string $path, array $options = []): ServerRequestInterface
    {
        // Check if 'multipart' is in options
        if (isset($options['multipart'])) {
            return $this->requestWithMultipart($method, $path, $options);
        }

        // Otherwise, use the parent implementation
        return parent::request($method, $path, $options);
    }

    protected function requestWithMultipart(string $method, string $path, array $options): ServerRequestInterface
    {
        $uploadedFiles = [];
        foreach ($options['multipart'] as $fileData) {
            if (!is_string($fileData['contents'])) {
                throw new \InvalidArgumentException("The 'contents' must be a string file path.");
            }

            $stream = new Stream(fopen($fileData['contents'], 'r+'));
            $uploadedFile = new UploadedFile(
                $stream,
                $stream->getSize(),
                UPLOAD_ERR_OK,
                $fileData['filename'],
                $fileData['type'] ?? 'application/octet-stream'
            );

            $uploadedFiles['files'][] = $uploadedFile;
        }

        $request = new ServerRequest([], $uploadedFiles, $path, $method);

        // Do we want a JSON request body?
        if (isset($options['json'])) {
            $request = $this->requestWithJsonBody(
                $request,
                $options['json']
            );
        }

        // Authenticate as a given user
        if (isset($options['authenticatedAs'])) {
            $request = $this->requestAsUser(
                $request,
                $options['authenticatedAs']
            );
        }

        return $request;
    }

    protected function uploadFile(string $path)
    {
        if (!file_exists($path)) {
            throw new \InvalidArgumentException("File not found at path: $path");
        }

        return [
            'contents' => $path,
            'filename' => basename($path),
        ];
    }

    protected function fixtures(string $file): string
    {
        return __DIR__.'/fixtures/'.$file;
    }
}
